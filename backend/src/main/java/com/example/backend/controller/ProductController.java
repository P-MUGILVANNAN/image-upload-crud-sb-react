package com.example.backend.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.model.Product;
import com.example.backend.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend to access backend
public class ProductController {

    private final ProductRepository productRepository;
    private static final String UPLOAD_DIR = "uploads/"; // Folder to save images

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostMapping(consumes = "multipart/form-data")
    public Product addProduct(
            @RequestParam("name") String name,
            @RequestParam("mrp") double mrp,
            @RequestParam("price") double price,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image) {

        try {
            // Define the uploads directory
            final String UPLOAD_DIR = "uploads/";

            // Ensure upload directory exists
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs(); // Create the folder if it doesn't exist
            }

            // Save Image
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path imagePath = Path.of(UPLOAD_DIR + fileName);
            Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

            // Save Product in Database
            Product product = new Product();
            product.setName(name);
            product.setMrp(mrp);
            product.setPrice(price);
            product.setDescription(description);
            product.setImageUrl(fileName); // Store image filename

            return productRepository.save(product); // Return saved product object
        } catch (Exception e) {
            throw new RuntimeException("Error saving product: " + e.getMessage());
        }
    }

    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }
    
    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("mrp") double mrp,
            @RequestParam("price") double price,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        product.setName(name);
        product.setMrp(mrp);
        product.setPrice(price);
        product.setDescription(description);

        // Check if a new image is uploaded
        if (image != null && !image.isEmpty()) {
            try {
                final String UPLOAD_DIR = "uploads/";
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                // Save new image
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path imagePath = Path.of(UPLOAD_DIR + fileName);
                Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

                // Set new image path
                product.setImageUrl(fileName);
            } catch (Exception e) {
                throw new RuntimeException("Error updating product image: " + e.getMessage());
            }
        }

        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        // Delete the image from the uploads folder
        if (product.getImageUrl() != null) {
            File imageFile = new File("uploads/" + product.getImageUrl());
            if (imageFile.exists()) {
                imageFile.delete();
            }
        }

        productRepository.delete(product);
        return "Product with ID " + id + " has been deleted successfully.";
    }


}